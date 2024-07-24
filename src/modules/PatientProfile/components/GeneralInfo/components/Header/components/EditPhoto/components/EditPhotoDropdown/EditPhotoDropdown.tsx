const EditPhotoDropdown = () => {
    return (
        <ul className="py-3 rounded-md bg-white shadow-menu-dropdown">
            <li className="px-4 py-2 cursor-pointer hover:bg-gray-200">Delete photo</li>
            <li className="px-4 py-2 cursor-pointer hover:bg-gray-200">Change photo</li>
        </ul>
    );
};

export default EditPhotoDropdown;
