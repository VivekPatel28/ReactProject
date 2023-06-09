import { Customers } from "./components/Customers/CustomerIndex";
import { Home } from "./components/Home";
import { Products } from "./components/Products/ProductIndex";
import { Sales } from "./components/Sales/SalesIndex";
import { Stores } from "./components/Stores/StoreIndex";

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/customers',
        element: <Customers />
    },
    {
        path: '/products',
        element: <Products />
    },
    {
        path: '/stores',
        element: <Stores />
    },
    {
        path: '/sales',
        element: <Sales />
    }
];

export default AppRoutes;
