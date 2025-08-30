function Footer() {
    return (
        <footer className="border-t border-base-200">
            <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <div className="font-bold text-xl">SportNow</div>
                    <div className="text-sm opacity-70">Discover. Reserve. Play.</div>
                </div>
                <div className="flex items-center gap-6">
                    <a className="link link-hover">Activities</a>
                    <a className="link link-hover">Venues</a>
                    <a className="link link-hover">Contact</a>
                </div>
                <div className="text-sm opacity-70">© {new Date().getFullYear()} SportNow</div>
            </div>
        </footer>
    );
}

export default Footer;