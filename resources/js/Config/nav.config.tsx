interface INavItem {
    title: string,
    route: string,
    key: string
};

export const NavItems: INavItem[] = [
    {
        title: "Dashboard",
        route: 'dashboard',
        key: 'dashboard'
    },
    {
        title: "Flight",
        route: 'flight',
        key: 'flight'
    },
    {
        title: "Hotel",
        route: 'hotel',
        key: 'hotel'
    },
    {
        title: "Car",
        route: 'car',
        key: 'car'
    },
    {
        title: "Golf",
        route: 'golf',
        key: 'golf'
    }
]

