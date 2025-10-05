import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";

function SignaturePad() {
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const navigate = useNavigate();
  const { documentId } = useParams();

  const clear = () => {
    sigCanvasRef.current?.clear();
  };

  const save = () => {
    if (sigCanvasRef.current?.isEmpty()) {
      alert("Please provide a signature first.");
      return;
    }

    const dataURL = sigCanvasRef.current?.toDataURL("image/png");
    console.log("Signature Image (base64):", dataURL);
    navigate(`/pdf/${documentId}`);

  };

  return (
    <div className="signature-wrapper">
      <h2>Draw your signature</h2>
      <SignatureCanvas
        ref={sigCanvasRef}
        canvasProps={{
          width: 400,
          height: 200,
          className: "signature-canvas",
        }}
        backgroundColor="#f9f9f9"
        penColor="black"
      />
      <div className="buttons">
        <button onClick={clear} className="button is-warning">
          Clear
        </button>
        <button onClick={save} className="button is-primary ml-2">
          Save
        </button>
      </div>
    </div>
  );
}

export default SignaturePad;
function useState<T>(arg0: string): [any, any] {
  throw new Error("Function not implemented.");
}

function useEffect(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}
