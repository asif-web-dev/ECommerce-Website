const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-6 mt-10 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} ShopMate. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-2 text-sm">
          <a href="#" className="hover:text-blue-500 transition">Privacy Policy</a>
          <a href="#" className="hover:text-blue-500 transition">Terms of Service</a>
          <a href="#" className="hover:text-blue-500 transition">Contact</a>
        </div>
      </div>
    </footer>
  );
};


export default Footer