import { NoteManagement } from "@/class/[uuid]/note-cards";
import ClassName from "./class-name";
import NavBar from "@/components/navbar"; // Assuming the Navbar component is located in the components directory
import Description from "./Description";
import ProcessingStatus from "./processing-status";

export default function Page({ params }: { params: { uuid: string } }) {
  return (
    <>
      <NavBar />
      <ClassName uuid={params.uuid} />
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <Description uuid={params.uuid} />
      </div>
      <NoteManagement classUuid={params.uuid} />
    </>
  );
}
