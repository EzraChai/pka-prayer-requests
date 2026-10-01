import { AddNewPrayerForm } from "@/components/add-prayer-form";
import DisconnectDeviceButton from "@/components/disconnect-device-button";
import GenerateLinkButton from "@/components/generate-link-button";
import MyPrayers from "@/components/my-prayers";
import { Card } from "@/components/ui/card";

export default function MyPrayersPage() {
  return (
    <div className="mt-24 ">
      <Card className=" m-4 md:m-12 bg-lime-300 ">
        <div className="flex gap-12 px-2 md:px-12 py-2 md:py-6">
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
          <div className="hidden md:flex md:w-72 flex-col gap-6">
            <AddNewPrayerForm />
            <GenerateLinkButton />
            <div className="mt-2 border-t-2 border-black/30 pt-4">
              <p className="mb-2 text-sm font-bold uppercase tracking-wide">
                Device access
              </p>
              <DisconnectDeviceButton />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-2 md:hidden">
          <GenerateLinkButton />
          <div className="border-t-2 border-black/30 pt-4">
            <p className="mb-2 text-sm font-bold uppercase tracking-wide">
              Device access
            </p>
            <DisconnectDeviceButton />
          </div>
        </div>
      </Card>
      <section className="mt-12 mb-12 px-4 md:px-12">
        <h2 className="text-2xl font-bold">My Prayers</h2>
        <p className="text-lg">You can find all your written prayers here.</p>
        <MyPrayers />
      </section>
      <div className="fixed bottom-4 md:bottom-16 right-4 md:right-12 md:hidden">
        <AddNewPrayerForm />
      </div>
    </div>
  );
}
