import { useOthers, useSelf } from "@liveblocks/react/suspense";
import Image from "next/image";
import React from "react";

const ActiveCollaboratorsList = () => {
  const others = useOthers();
  const collaborators = others?.map((other) => other?.info);
  return <ul className="collaborators-list">

    {
      collaborators?.map((item:any,index:number)=>{
        return (
          <li key={index}>
            <Image
            src={item?.avatar}
            width={100}
            height={100}
            className="inline-block size-8 rounded-full ring-2 ring-dark-100"
            alt="img"
            style={{border:`3px solid ${item?.color}`}}
            />
          </li>
        )
      })
    }
  </ul>;
};

export default ActiveCollaboratorsList;
// {
//   "connectionId": 1,
//   "id": "user_2jTbDu8TFtHPK9dzCeceIYm72li",
//   "info": {
//       "name": "Aman Sharma",
//       "avatar": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJqVGJQdVE1TFBVcHA5VlJ2R1E0NWQ1eGNSViJ9",
//       "id": "user_2jTbDu8TFtHPK9dzCeceIYm72li",
//       "email": "aman.sharma@polynomial.ai",
//       "color": "#FF007F"
//   },
//   "canWrite": true,
//   "canComment": true,
//   "isReadOnly": false,
//   "presence": {}
// }
