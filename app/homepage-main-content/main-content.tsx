import { MainContentClient } from "./main-content-client";

const MainContent = () => {
    return (
        <main className="flex-1 container mx-auto flex flex-col md:flex-row items-center justify-between py-16 px-4">
            <MainContentClient />
        </main>
    );
};

export { MainContent }