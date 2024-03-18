import "../env";
import { db } from "@/server/db";
import { colleges } from "@/server/db/schema";

const data: Array<typeof colleges.$inferInsert> = [
  {
    name: "L. D. College of Engineering",
    state: "Gujarat",
    domain: "ldce.ac.in",
    yearOfEstablishment: 1948,
    district: "Ahmedabad",
    website: "https://www.ldce.ac.in/",
    university: "Gujarat Technological University",
    address:
      "L. D. College of Engineering, Navrangpura, Ahmedabad, Gujarat 380015",
  },
  {
    name: "Nirma University",
    state: "Gujarat",
    domain: "nirmauni.ac.in",
    yearOfEstablishment: 2003,
    district: "Ahmedabad",
    website: "https://www.nirmauni.ac.in/",
    university: "Nirma University",
    address: "Nirma University, Sarkhej-Gandhinagar Highway, Ahmedabad",
  },
  {
    name: "Indian Institute of Technology Gandhinagar",
    state: "Gujarat",
    domain: "iitgn.ac.in",
    yearOfEstablishment: 2008,
    district: "Gandhinagar",
    website: "https://www.iitgn.ac.in/",
    university: "Indian Institute of Technology Gandhinagar",
    address: "Indian Institute of Technology Gandhinagar, Palaj, Gandhinagar",
  },
];

data.forEach((college) => {
  db.insert(colleges)
    .values(college)
    .then(() => console.log("Added", college.name));
});
