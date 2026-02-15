import { AddNewPrayerForm } from "@/components/add-prayer-form";
import GenerateLinkButton from "@/components/generate-link-button";
import MyPrayers from "@/components/my-prayers";
import { Card } from "@/components/ui/card";
import { Edit } from "lucide-react";

export default function MyPrayersPage() {
  return (
    <div className="mt-24 ">
      <Card className=" m-4 md:m-12 bg-lime-300 ">
        <div className="flex gap-12 px-2 md:px-12 py-2 md:py-6">
          <button className="hidden text-justify md:flex px-4 md:w-24 md:h-24  justify-center items-center bg-white text-black border-3 border-black rotate-3  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 ease-out hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ">
            <Edit className="md:w-24 md:h-24" />
          </button>
          <div className="flex-1">
            <h3 className="text-xl md:text-3xl font-bold pb-2">
              Manage My Prayers
            </h3>
            <p className="text-base md:text-lg">
              Your spiritual journey, loud and proud. No login needed. Use your{" "}
              <span className="font-bold border-2 border-black bg-white px-2">
                Unique Link
              </span>{" "}
              to access these on any other devices. <br /> Copy and paste the
              link onto a new device to get started, each device requires its
              own unique link.
            </p>
          </div>
          <div className="hidden md:flex flex-col gap-6">
            <AddNewPrayerForm />
            <GenerateLinkButton />
          </div>
        </div>
        <div className="p-2 flex gap-6 md:hidden">
          <GenerateLinkButton />
        </div>
      </Card>
      <section className="mt-12 px-4 md:px-12">
        <h2 className="text-2xl font-bold">My Prayers</h2>
        <p className="text-lg">Here you can find all your written prayers.</p>
        <MyPrayers />
      </section>
      <div className="fixed bottom-4 md:bottom-16 right-4 md:right-12 md:hidden">
        <AddNewPrayerForm />
      </div>
    </div>
  );
}
