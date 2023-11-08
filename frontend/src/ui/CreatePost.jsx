import { useState } from "react";
import NavItem from "../components/NavItem";
import CreatePostWindow from "../features/posts/CreatePostWindow";
import Modal from "../components/Modal";

function CreatePost() {
  const [stepCount, setStepCount] = useState(0);

  return (
    <>
      <Modal.Button opens="create">
        <NavItem
          src="post-icon.png"
          text="Create"
          onClick={(e) => e.preventDefault()}
        />
      </Modal.Button>
      <Modal.Window
        name="create"
        className={`${stepCount > 0 ? "w-4/6" : "w-3/6"} h-4/6 rounded-xl`}
      >
        <CreatePostWindow stepCount={stepCount} setStepCount={setStepCount} />
      </Modal.Window>
    </>
  );
}

export default CreatePost;
