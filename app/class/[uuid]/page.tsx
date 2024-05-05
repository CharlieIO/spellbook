import { NoteManagement } from "@/class/[uuid]/note-management";
import ClassName from "./ClassName";
import NavBar from "@/components/NavBar"; // Assuming the Navbar component is located in the components directory

export default function Page({ params }: { params: { uuid: string } }) {
  return (
    <>
      <NavBar />
      <ClassName uuid={params.uuid} />
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-lg mt-4 mb-2">
        Begin your quest for knowledge! Submit your enchanted notes as images and watch the secrets reveal themselves. Be wary, each artifact (image file) should weigh no more than 20MB.        </p>
      </div>
      <NoteManagement classUuid={params.uuid} />
    </>
  );
}
