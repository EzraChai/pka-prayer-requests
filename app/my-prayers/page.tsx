import { AddNewPrayerForm } from "@/components/addPrayerForm";
import MyPrayers from "@/components/MyPrayers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit } from "lucide-react";

export default function MyPrayersPage() {
  return (
    <div>
      <Card className="m-12 bg-lime-300 ">
        <div className="flex gap-12 px-12 py-6">
          <button className=" px-4 w-24 h-24 flex justify-center items-center bg-white text-black border-3 border-black rotate-3  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 ease-out hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ">
            <Edit className="w-24 h-24" />
          </button>
          <div className="flex-1">
            <h3 className="text-3xl font-bold pb-2">Manage My Prayers</h3>
            <p className="text-lg">
              Your spiritual journey, loud and proud. No login needed. Use your{" "}
              <span className="font-bold border-2 border-black bg-white px-2">
                Unique Edit Link
              </span>{" "}
              to access these on any other devices. <br /> Press the Copy Link
              button and paste it in your other devices to access your prayers.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <AddNewPrayerForm />
            <Button className="bg-indigo-600 border-3 text-3xl font-black p-8">
              Copy Link
            </Button>
          </div>
        </div>
      </Card>
      <section className="px-12">
        <h2 className="text-2xl font-bold">My Prayers</h2>
        <p className="text-lg">Here you can find all your saved prayers.</p>
        <MyPrayers />
      </section>
    </div>
  );
}
