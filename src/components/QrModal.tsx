interface AuthModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  qrSource: string;
}


const AuthModal: React.FC<AuthModalProps> = ({ isOpen, setIsOpen, qrSource }) => {
  if (!isOpen) return null;

  return (
    <div className="modal is-active">
      <div className="modal-background is-flex is-justify-content-center is-align-items-center" onClick={() => setIsOpen(false)}>
        <img
          src={qrSource !== "" ? qrSource : "https://www.w3schools.com/howto/img_lights.jpg"}
          alt="qr-code"
          width={250}
          height={250}
        />
      </div>
    </div>
  );
};

export default AuthModal;
