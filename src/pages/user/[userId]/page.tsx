import { redirect } from "next/navigation";

const UserPage = ({ params }: { params: { userId: string } }) => {
  redirect(`${params.userId}/home`);
};

export default UserPage;
