import { db } from "../src/prisma/db";

async function main() {
  console.log("Updating cardiology...");
  await db.orm.public.Specialty.where({ slug: "cardiology" }).update({
    photo: "/media/cardiology.jpg",
    summary: "Advanced cardiac care, from minimally invasive valve replacements to complex bypass surgeries, delivered by JCI-accredited specialists.",
    overview: "Our cardiology pathway partners with Europe and Asia's leading heart institutes. We ensure your pre-operative diagnostics are seamlessly transferred, and your recovery is monitored by a dedicated cardiac rehabilitation team."
  });

  console.log("Updating orthopedics...");
  await db.orm.public.Specialty.where({ slug: "orthopedics" }).update({
    photo: "/media/orthopedics.jpg",
    summary: "World-class joint replacement and spine surgery with integrated, resort-style physical therapy.",
    overview: "Orthopedic surgery requires flawless rehabilitation. Our pathways bundle your procedure with intensive, guided physical therapy in a luxury recovery setting, ensuring you return home with restored mobility."
  });

  console.log("Updating total-knee-replacement...");
  await db.orm.public.Package.where({ slug: "total-knee-replacement" }).update({
    photo: "/media/total-knee-replacement.jpg",
    summary: "A comprehensive 14-day pathway for total knee arthroplasty, including surgery, private recovery suite, and daily physical therapy."
  });

  console.log("Updating hip-replacement...");
  await db.orm.public.Package.where({ slug: "hip-replacement" }).update({
    photo: "/media/hip-replacement.jpg",
    summary: "Minimally invasive hip replacement surgery followed by tailored rehabilitation in a premium wellness pavilion."
  });

  console.log("Updating all-on-4-implants...");
  await db.orm.public.Package.where({ slug: "all-on-4-implants" }).update({
    photo: "/media/all-on-4-implants.jpg",
    summary: "Full-arch dental restoration using the All-on-4 technique, performed in a hyper-modern clinic with panoramic city views."
  });

  console.log("Done updating content!");
}

main().catch(console.error);
