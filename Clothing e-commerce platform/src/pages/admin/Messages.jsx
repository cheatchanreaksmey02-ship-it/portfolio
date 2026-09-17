import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const AVATAR_COLORS = ['#088178', '#2563eb', '#7c3aed', '#d97706', '#e63946', '#0891b2', '#c026d3'];
function avatarColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
function initials(name) {
  return (name || '?').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  async function load() {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    setMessages(data || []);
  }
  useEffect(() => { load(); }, []);

  const selected = messages.find(m => m.id === selectedId);

  function select(m) {
    setSelectedId(m.id);
    setReply(m.admin_reply || '');
    if ((m.status || 'unread') === 'unread') {
      supabase.from('messages').update({ status: 'pending' }).eq('id', m.id);
      setMessages(prev => prev.map(x => x.id === m.id ? { ...x, status: 'pending' } : x));
    }
  }

  async function sendReply() {
    if (!reply.trim() || !selected) return;
    setSending(true);
    await supabase.from('messages').update({ admin_reply: reply, status: 'replied', replied_at: new Date().toISOString() }).eq('id', selected.id);
    setMessages(prev => prev.map(x => x.id === selected.id ? { ...x, admin_reply: reply, status: 'replied' } : x));
    setSending(false);
  }

  const total = messages.length;
  const unread = messages.filter(m => (m.status || 'unread') === 'unread').length;
  const replied = messages.filter(m => m.status === 'replied').length;
  const pending = messages.filter(m => m.status === 'pending').length;

  return (
    <div className="msg-wrap" style={{ minHeight: 'auto' }}>
      <div className="msg-main" style={{ padding: 0 }}>
        <div className="msg-topbar">
          <div><h1>Contact Messages</h1><p>View and respond to customer messages.</p></div>
        </div>

        <div className="msg-kpis">
          <div className="msg-kpi-card"><div className="msg-kpi-icon" style={{ background: '#e6f2ef', color: '#088178' }}><i className="fas fa-envelope"></i></div><div><p className="label">Total Messages</p><h3>{total}</h3></div></div>
          <div className="msg-kpi-card"><div className="msg-kpi-icon" style={{ background: '#eaf1fb', color: '#2563eb' }}><i className="fas fa-envelope-open"></i></div><div><p className="label">Unread</p><h3>{unread}</h3></div></div>
          <div className="msg-kpi-card"><div className="msg-kpi-icon" style={{ background: '#f2ecfb', color: '#7c3aed' }}><i className="fas fa-reply"></i></div><div><p className="label">Replied</p><h3>{replied}</h3></div></div>
          <div className="msg-kpi-card"><div className="msg-kpi-icon" style={{ background: '#fdf0e2', color: '#d97706' }}><i className="fas fa-clock"></i></div><div><p className="label">Pending</p><h3>{pending}</h3></div></div>
        </div>

        <div className="msg-content-grid">
          <div className="msg-panel">
            <div className="msg-list-head"><h3>Messages ({total})</h3></div>
            <div>
              {messages.length === 0 ? (
                <div className="msg-empty">No messages found.</div>
              ) : messages.map(m => {
                const status = m.status || 'unread';
                const color = avatarColor(m.email || m.name || '?');
                return (
                  <div key={m.id} className={`msg-row ${m.id === selectedId ? 'selected' : ''}`} onClick={() => select(m)}>
                    <div className="avatar" style={{ background: color }}>{initials(m.name)}</div>
                    <div className="msg-row-body">
                      <div className="msg-row-top">
                        <span className="name">{m.name || 'Unknown'}</span>
                        {status === 'unread' && <span className="dot-unread"></span>}
                      </div>
                      <div className="msg-row-email">{m.email || ''}</div>
                      <div className="msg-row-subject">{m.subject || '(no subject)'}</div>
                    </div>
                    <div className="msg-row-meta">
                      <span className={`msg-badge ${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="msg-panel" id="msg-detail-panel">
            {!selected ? (
              <div className="msg-empty">Select a message to view it here.</div>
            ) : (
              <>
                <div className="msg-detail-head">
                  <h3>{selected.subject || '(no subject)'}</h3>
                </div>
                <div className="msg-detail-body">
                  <div className="msg-detail-from">
                    <div className="avatar" style={{ background: avatarColor(selected.email || selected.name || '?') }}>{initials(selected.name)}</div>
                    <div className="msg-detail-from-text">
                      <strong>{selected.name || 'Unknown'} &lt;{selected.email || ''}&gt;</strong>
                    </div>
                  </div>
                  <div className="msg-detail-text">{selected.message}</div>
                </div>
                <div className="msg-reply">
                  <h4>Reply</h4>
                  <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..."></textarea>
                  <div className="msg-reply-bottom">
                    <button className="msg-send-btn" disabled={sending} onClick={sendReply}>{sending ? 'Sending...' : 'Send Reply'}</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
