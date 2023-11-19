import { useState } from "react";
import NavItem from "../../components/NavItem";
import CreatePostModal from "./CreatePostModal";
import Modal from "../../components/Modal";

function CreatePostButton({ text }) {
  const [stepCount, setStepCount] = useState(0);

  return (
    <>
      <Modal.Button opens="create">
        <NavItem
          src="post-icon.png"
          text={text}
          onClick={(e) => e.preventDefault()}
        />
      </Modal.Button>
      <Modal.Window name="create">
        <CreatePostModal stepCount={stepCount} setStepCount={setStepCount} />
      </Modal.Window>
    </>
  );
}

export default CreatePostButton;
