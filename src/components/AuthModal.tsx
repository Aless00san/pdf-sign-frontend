import React, { useState } from "react";

interface AuthModalProps {
  title: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  submit: {
    login: (email: string, password: string) => void;
    register: (email: string, password: string) => void;
  };
}

const AuthModal: React.FC<AuthModalProps> = ({
  title,
  isOpen,
  setIsOpen,
  submit,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (title === "Login") {
      submit.login(email, password);
    } else {
      submit.register(email, password);
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={() => setIsOpen(false)}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button
            className="delete"
            aria-label="close"
            onClick={() => setIsOpen(false)}
          ></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={onSubmit}>
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  className="input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="field is-grouped is-grouped-right">
              <div className="control">
                <button type="submit" className="button is-primary">
                  {title}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AuthModal;
