"use client";

import Announcements from "@/app/components/Announcements";
import BigCalendar from "@/app/components/BigCalender";
import FormModal from "@/app/components/FormModal";
import Performance from "@/app/components/Performance";
import Image from "next/image";
import Link from "next/link";
import useUserRole from "@/hooks/useUserRole";

const SingleTeacherPage = () => {
  const role = useUserRole(); // ✅ dynamic role detection

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Teacher"
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">Leonard Snyder</h1>
                {role === "admin" && (
                  <FormModal
                    table="teacher"
                    type="update"
                    data={{
                      id: 1,
                      username: "deanguerrero",
                      email: "deanguerrero@gmail.com",
                      password: "password",
                      firstName: "Dean",
                      lastName: "Guerrero",
                      phone: "+1 234 567 89",
                      address: "1234 Main St, Anytown, USA",
                      bloodType: "A+",
                      dateOfBirth: "2000-01-01",
                      sex: "male",
                      img: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200",
                    }}
                  />
                )}
              </div>
              <p className="text-sm text-gray-500">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="Blood Type" width={14} height={14} />
                  <span>A+</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="DOB" width={14} height={14} />
                  <span>January 2025</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="Email" width={14} height={14} />
                  <span>user@gmail.com</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="Phone" width={14} height={14} />
                  <span>+1 234 567</span>
                </div>
              </div>
            </div>
          </div>

          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {[
              { icon: "/singleAttendance.png", label: "Attendance", value: "90%" },
              { icon: "/singleBranch.png", label: "Branches", value: "2" },
              { icon: "/singleLesson.png", label: "Lessons", value: "6" },
              { icon: "/singleClass.png", label: "Classes", value: "6" },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]"
              >
                <Image src={card.icon} alt={card.label} width={24} height={24} className="w-6 h-6" />
                <div>
                  <h1 className="text-xl font-semibold">{card.value}</h1>
                  <span className="text-sm text-gray-400">{card.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            {[
              { label: "Teacher's Classes", href: "/" },
              { label: "Teacher's Students", href: "/" },
              { label: "Teacher's Lessons", href: "/" },
              { label: "Teacher's Exams", href: "/" },
              { label: "Teacher's Assignments", href: "/" },
            ].map((link, index) => (
              <Link
                key={index}
                className={`p-3 rounded-md ${
                  index % 2 === 0
                    ? "bg-lamaSkyLight"
                    : index % 3 === 0
                    ? "bg-lamaPurpleLight"
                    : index % 5 === 0
                    ? "bg-pink-50"
                    : "bg-lamaYellowLight"
                }`}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
