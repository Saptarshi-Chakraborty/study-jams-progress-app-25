import { Home, UploadCloud, BarChart2, User, Building2Icon, ShieldUser, UsersIcon, FileChartColumnIncreasing, ChartNoAxesCombined } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useGlobalContext, ROLES } from '../../context/GlobalContext';

export const TopUserBar = () => {
    const { user } = useGlobalContext();
    const router = useRouter();

    // Conditionally render the bar. Do not show for participants or logged-out users.
    if (!user || user.role === ROLES.PARTICIPANT) {
        return null;
    }

    const navItems = [
        // { name: 'Home', icon: Home, href: '/my-profile' }, // All admin-level roles
        { name: 'Upload Report', icon: UploadCloud, href: '/daily_reports/upload', roles: [ROLES.ADMIN, ROLES.ORGANISER] },
        { name: 'All Reports', icon: FileChartColumnIncreasing, href: '/daily_reports', roles: [ROLES.ADMIN, ROLES.ORGANISER] },
        { name: 'Individual Reports', icon: ChartNoAxesCombined, href: '/individual-reports', roles: [ROLES.ADMIN, ROLES.ORGANISER, ROLES.TEAM_MEMBER] },
        // { name: 'My Participants', icon: Users, href: '/participants', roles: [ROLES.ADMIN, ROLES.ORGANISER] },
        { name: 'Chapters', icon: Building2Icon, href: '/admin/chapters', roles: [ROLES.ADMIN] },
        { name: 'Users', icon: ShieldUser, href: '/admin/users', roles: [ROLES.ADMIN] },
        // { name: 'Team Members', icon: UsersIcon, href: '/organiser/team-members', roles: [ROLES.ORGANISER] },
    ];

    return (
        <div className="bg-white">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-1">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex justify-between items-center">
                        <div className="flex-shrink-0">
                            <span className="text-base font-bold text-gray-900">Admin Panel</span>
                        </div>
                        <div className="flex ml-4 min-w-0">

                            {navItems
                                .filter(item => !item.roles || item.roles.includes(user.role))
                                .map((item) => {
                                    const isActive = router.pathname === item.href;
                                    return (
                                        <NavItem key={item.name}
                                            router={router}
                                            name={item.name}
                                            href={item.href}
                                            icon={item.icon} />
                                    );
                                })}

                            {
                                ((user.role === "organiser" || user.role === 'admin') &&
                                    (user.chapter_id && user.chapter_id > 0)) &&
                                (
                                    <NavItem
                                        router={router}
                                        name="Team Members"
                                        href={`/organiser/team-members`}
                                        icon={UsersIcon} />
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



const NavItem = ({ router, name, href, icon: Icon }) => {
    const isActive = router.pathname === href;
    return (
        <Link href={href} className="flex-shrink-0">
            <div
                className={`inline-flex items-center px-4 text-sm font-medium ${isActive
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                <Icon className="mr-2 h-5 w-5" />
                {name}
            </div>
        </Link>
    );
}
