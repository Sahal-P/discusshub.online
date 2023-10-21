"use client"

import dynamic from "next/dynamic";
import Image from "next/image";
import { FC } from "react";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false }
);

interface EditorOutputProps {
    content: any
}

const style = {
    paragraph: {
        fontSize: '0.875rem',
        lineHeight: '1.25rem'
    }
}

function CustomImageRenderer({data}: any) {
    const src = data.file.url

    return (
        <div className="relative w-full min-h-[15rem]">
            <Image alt="post-image" className="object-contain" fill src={src} />
        </div>
    )
}

function CustomCodeRenderer({data}: any) {
    return (
        <pre className="bg-gray-800 rounded-md p-4">
            <code className="text-gray-100 text-sm ">{data.code}</code>
        </pre>
    )
}

function CustomHeaderRenderer({ data }: any) {
    return (
      <h2 className="text-xl font-bold">{data.text}</h2>
    );
  }
  
function CustomListRenderer({ data }: any) {
    return (
      <ul>
        {data.items.map((item: string, index: number) => (
          <li key={index}>{item}</li>
        )
        )
    }
      </ul>
    );
  }

// function CustomTableRenderer({data}: any) {
//     const table = document.createElement('table');
  
//     // Create the table header row.
//     const headerRow = document.createElement('tr');
//     for (const heading of data.content[0]) {
//       const headerCell = document.createElement('th');
//       headerCell.textContent = heading;
//       headerRow.appendChild(headerCell);
//     }
//     table.appendChild(headerRow);
  
//     // Create the table body rows.
//     for (const row of data.content.slice(1)) {
//       const bodyRow = document.createElement('tr');
//       for (const cell of row) {
//         const bodyCell = document.createElement('td');
//         bodyCell.textContent = cell;
//         bodyRow.appendChild(bodyCell);
//       }
//       table.appendChild(bodyRow);
//     }
  
//     return table;
//   }
  

const renderer = {
    image: CustomImageRenderer,
    code: CustomCodeRenderer,
    header: CustomHeaderRenderer, 
    list: CustomListRenderer,
    // table: CustomTableRenderer
}

const EditorOutput: FC<EditorOutputProps> = ({content}) => {
  return <Output data={content} style={style} className="text-sm" renderer={renderer} />
};

export default EditorOutput;
