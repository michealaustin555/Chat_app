import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axioss from "../utils/axios";

const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [selectedmsg, setSelectedmsg] = useState(null);
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("chatapp-user"));

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axioss.get("/api/loggeduser/");
        setContacts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchContacts();
  }, []);

  // Fetch messages
  useEffect(() => {
    if (!selected) return;
    const fetchMessages = async () => {
      try {
        const res = await axioss.get(`/api/message/${selected._id}`);
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [selected]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selected) return;
    try {
      const res = await axioss.post(
        `/api/message/send/${selected._id}`,
        { message: newMessage }
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMessage = async (msgid) => {
    try {
      await axioss.delete(`api/message/${msgid}`);
      setMessages(messages.filter(m => m._id !== msgid));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await axioss.post("/api/auth/logout");
      localStorage.removeItem("chatapp-user");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditName = async () => {
    try {
      const res = await axioss.put("/api/auth/update", {
        fullname: newName,
      });
      localStorage.setItem("chatapp-user", JSON.stringify(res.data));
      setEditName(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const getInitials = (name) => name?.charAt(0).toUpperCase() || "?";

  const filteredContacts = contacts.filter(c =>
    c.fullname?.toLowerCase().includes(search.toLowerCase()) ||
    c.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="chat-wrapper">

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">Chat<span>App</span></div>
        </div>

        <div className="search-wrap">
          <div className="search-wrap-inner">
            <i className="bi bi-search"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="contact-list">
          {filteredContacts.length === 0 && (
            <p style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", padding: 20, fontSize: 13 }}>
              No contacts found
            </p>
          )}
          {filteredContacts.map(contact => (
            <div
              key={contact._id}
              className={`contact-item ${selected?._id === contact._id ? "active" : ""}`}
              onClick={() => setSelected(contact)}
            >
              <div className="avatar-wrap">
                <div className="contact-avatar">
                  {getInitials(contact.fullname)}
                </div>
                {contact.online && <div className="online-dot"></div>}
              </div>
              <div className="contact-info">
                <div className="contact-name">{contact.fullname}</div>
                <div className="contact-last-msg">{contact.username}</div>
              </div>
              <div style={{ fontSize: 11, color: "rgba(30, 23, 23, 0.3)", flexShrink: 0 }}>
                {contact.time}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div style={{ position: "relative" }}>
          {editName && (
            <div style={{
              position: "absolute",
              bottom: 70,
              left: 10,
              background: "#1a1a2e",
              border: "1px solid #374151",
              borderRadius: 12,
              padding: 16,
              zIndex: 100,
              minWidth: 250,
            }}>
              <p style={{ color: "#9ca3af", margin: "0 0 4px 0", fontSize: 13 }}>
                Current name
              </p>
              <p style={{ color: "white", margin: "0 0 12px 0", fontWeight: 600 }}>
                {currentUser?.fullname || currentUser?.username}
              </p>
              <p style={{ color: "#9ca3af", margin: "0 0 6px 0", fontSize: 13 }}>
                New name
              </p>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new name..."
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #374151",
                  background: "#111113",
                  color: "white",
                  fontSize: 14,
                  marginBottom: 10,
                  boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleEditName}
                  style={{ flex: 1, background: "#6366f1", color: "white", border: "none", borderRadius: 8, padding: "8px 0", cursor: "pointer", fontSize: 14 }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditName(false)}
                  style={{ flex: 1, background: "transparent", color: "#9ca3af", border: "1px solid #374151", borderRadius: 8, padding: "8px 0", cursor: "pointer", fontSize: 14 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div
            className="sidebar-footer"
            onClick={() => {
              setEditName(!editName);
              setNewName(currentUser?.fullname || "");
            }}
            style={{ cursor: "pointer" }}
          >
            <div className="avatar-wrap">
              <div className="contact-avatar sm">
                {getInitials(currentUser?.fullname || currentUser?.username)}
              </div>
              <div className="online-dot"></div>
            </div>
            <div>
              <div className="my-name">
                {currentUser?.fullname || currentUser?.username}
              </div>
              <div className="my-status">● Online</div>
            </div>
            <button
              className="icon-btn logout-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              title="Logout"
            >
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="chat-area">
        {!selected ? (
          <div className="no-chat-selected">
            <i className="bi bi-chat-dots"></i>
            <p>Select a contact to start chatting</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="avatar-wrap">
                  <div className="contact-avatar">
                    {getInitials(selected.fullname)}
                  </div>
                  {selected.online && <div className="online-dot"></div>}
                </div>
                <div>
                  <p className="chat-header-name">{selected.fullname}</p>
                  <span className="chat-header-status">
                    {selected.online ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
              <div className="chat-header-icons">
                <button className="icon-btn"><i className="bi bi-telephone"></i></button>
                <button className="icon-btn"><i className="bi bi-camera-video"></i></button>
                <button className="icon-btn"><i className="bi bi-three-dots-vertical"></i></button>
              </div>
            </div>

            <div className="messages-area">
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUser?._id;
                return (
                  <div key={msg._id}>
                    <div
                      className={`message-row ${isMe ? "me" : "other"}`}
                      onClick={() => isMe && setSelectedmsg(selectedmsg === msg._id ? null : msg._id)}
                    >
                      <div className={`message-bubble ${isMe ? "me" : "other"}`}>
                        {msg.message}
                        <div className="message-time">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </div>
                    </div>

                    {selectedmsg === msg._id && isMe && (
                      <div style={{ display: "flex", justifyContent: "flex-end", marginRight: 16, marginTop: 4 }}>
                        <div
                          onClick={() => {
                            handleDeleteMessage(msg._id);
                            setSelectedmsg(null);
                          }}
                          style={{
                            background: "#1e1e2e",
                            color: "#ef4444",
                            padding: "6px 16px",
                            borderRadius: 8,
                            fontSize: 13,
                            cursor: "pointer",
                            border: "1px solid #ef4444"
                          }}
                        >
                          🗑️ Delete
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-bar">
              <button className="icon-btn" style={{ fontSize: 22 }}>
                <i className="bi bi-emoji-smile"></i>
              </button>
              <button className="icon-btn" style={{ fontSize: 20 }}>
                <i className="bi bi-paperclip"></i>
              </button>
              <input
                type="text"
                className="msg-input"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend(e)}
              />
              <button className="icon-btn" style={{ fontSize: 20 }}>
                <i className="bi bi-mic"></i>
              </button>
              <button className="send-btn" onClick={handleSend}>
                <i className="bi bi-send-fill"></i>
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default Home;