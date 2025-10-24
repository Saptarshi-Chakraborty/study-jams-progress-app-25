import { Home, UploadCloud, BarChart2, User, Building2Icon, ShieldUser, Users, FileChartColumnIncreasing, ChartNoAxesCombined } from 'lucide-react';
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
        { name: 'Reports', icon: FileChartColumnIncreasing, href: '/daily_reports', roles: [ROLES.ADMIN, ROLES.ORGANISER] },
        { name: 'Individual Reports', icon: ChartNoAxesCombined, href: '/individual-reports', roles: [ROLES.ADMIN, ROLES.ORGANISER, ROLES.TEAM_MEMBER] },
        // { name: 'My Participants', icon: Users, href: '/participants', roles: [ROLES.ADMIN, ROLES.ORGANISER] },
        { name: 'Chapters', icon: Building2Icon, href: '/admin/chapters', roles: [ROLES.ADMIN] },
        { name: 'Users', icon: ShieldUser, href: '/admin/users', roles: [ROLES.ADMIN] },
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
                                        <Link href={item.href} key={item.name} className="flex-shrink-0">
                                            <div
                                                className={`inline-flex items-center px-4 text-sm font-medium ${isActive
                                                    ? 'text-blue-600'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                <item.icon className="mr-2 h-5 w-5" />
                                                {item.name}
                                            </div>
                                        </Link>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
