import { NoteManagement } from "@/class/[uuid]/note-management";
import ClassName from "./ClassName";
import NavBar from "@/components/NavBar"; // Assuming the Navbar component is located in the components directory
import Description from "./Description";

export default function Page({ params }: { params: { uuid: string } }) {
  return (
    <>
      <NavBar />
      <ClassName uuid={params.uuid} />
      <Description uuid={params.uuid} />
      <NoteManagement classUuid={params.uuid} />
    </>
  );
}
