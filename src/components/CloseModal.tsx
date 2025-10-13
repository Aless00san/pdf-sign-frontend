interface QrModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const QrModal: React.FC<QrModalProps> = ({ isOpen, setIsOpen }) => {
  if (!isOpen) return null;

  return (
    <div className='modal is-active'>
      <div
        className='close-modal is-flex is-justify-content-center is-align-items-center'
        onClick={() => setIsOpen(false)}
      >
        <h1>Signature saved!</h1>
        <h2>You can now close this window.</h2>
      </div>
    </div>
  );
};

export default QrModal;
