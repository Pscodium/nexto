import React from "react";
import Table, { SelectColumnFilter, StatusPill } from "../components/table.jsx";
import { DashboardOutletContextProps } from "../dashboard.js";
import { useOutletContext } from "react-router-dom";



export default function Users() {
    const context = useOutletContext<DashboardOutletContextProps>();
    const user = context.authUser;

    const getData = () => [
        {
            name: `${user?.firstName} ${user?.lastName}`,
            email: user?.email,
            title: "Regional Paradigm Technician",
            department: "Optimization",
            status: "Active",
            role: user?.role,
            locate: "Locate1",
            posCoords: [260, 900],
            imgUrl:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
        },
        {
            name: "Cody Fisher",
            email: "cody.fisher@example.com",
            title: "Product Directives Officer",
            department: "Intranet",
            status: "Active",
            role: "Owner",
            locate: "Locate",
            imgUrl:
                "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
        },
        {
            name: "Esther Howard",
            email: "esther.howard@example.com",
            title: "Forward Response Developer",
            department: "Directives",
            status: "Active",
            role: "Member",
            locate: "Locate",
            imgUrl:
                "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
        },
        {
            name: "Jenny Wilson",
            email: "jenny.wilson@example.com",
            title: "Central Security Manager",
            department: "Program",
            status: "Active",
            role: "Member",
            locate: "Locate",
            imgUrl:
                "https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
        },
        {
            name: "Kristin Watson",
            email: "kristin.watson@example.com",
            title: "Lean Implementation Liaison",
            department: "Mobility",
            status: "Active",
            role: "Admin",
            locate: "Locate",
            imgUrl:
                "https://images.unsplash.com/photo-1532417344469-368f9ae6d187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
        },
        {
            name: "Cameron Williamson",
            email: "cameron.williamson@example.com",
            title: "Internal Applications Engineer",
            department: "Security",
            status: "Active",
            role: "Member",
            locate: "Locate",
            posCoords: [260, 900],
            imgUrl:
                "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
        }
    ];

    const columns = React.useMemo(
        () => [
            {
                Header: "Name",
                accessor: "name"
            },
            {
                Header: "Title",
                accessor: "title"
            },
            {
                Header: "Department",
                accessor: "department"
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: StatusPill
            },
            {
                Header: "Role",
                accessor: "role",
                Filter: SelectColumnFilter,
                filter: "includes"
            }
        ],
        []
    );

    const data = React.useMemo(() => getData(), []);

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col">
                <Table columns={columns} data={data} />
            </div>
        </div>
    );
}