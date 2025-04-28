import { ChevronDown, ChevronRight, Edit, Eye, Folder, FolderOpen, Plus, Trash2 } from "lucide-react";
import { useState } from "react";


const CategoryItem: React.FC<{
    category: Category,
    level: number,
    onEdit?: (category: Category) => void,
    onDelete?: (category: Category) => void,
    onView?: (category: Category) => void
    onAddSubcategory?: (parentCategory: Category) => void
}> = ({
    category,
    level,
    onEdit,
    onDelete,
    onView,
    onAddSubcategory
}) => {
        const [isOpen, setIsOpen] = useState(false);
        const [showActions, setShowActions] = useState(false);
        const hasChildren = category.children && category.children.length > 0;


        return (
            <div className="mb-1">
                <div
                    className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer relative"
                    style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
                    onClick={() => hasChildren && setIsOpen(!isOpen)}
                    onMouseEnter={() => setShowActions(true)}
                    onMouseLeave={() => setShowActions(false)}
                >
                    {hasChildren ? (
                        <span className="mr-1 text-gray-500">
                            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </span>
                    ) : (
                        <span className="ml-4 mr-1"></span>
                    )}

                    <span className="mr-2">
                        {isOpen ? <FolderOpen className="text-amber-500" /> : <Folder className="text-amber-500" />}
                    </span>

                    <span className={level === 0 ? "font-medium" : ""}>{category.name}</span>

                    {category.description && (
                        <span className="ml-2 text-xs text-gray-500 truncate max-w-xs">
                            {category.description}
                        </span>
                    )}

                    {showActions && (
                        <div className="absolute right-2 flex items-center space-x-2 bg-gray-50 px-2 py-1 rounded-md">
                            {onAddSubcategory && (!category.parent || category.parent === "") && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddSubcategory(category);
                                    }}
                                    className="text-green-600 hover:text-green-800"
                                    title="Add subcategory"
                                >
                                    <Plus size={16} />
                                </button>
                            )}
                            {onEdit && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(category);
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Edit category"
                                >
                                    <Edit size={16} />
                                </button>
                            )}
                            {onView && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onView(category);
                                    }}
                                    className="text-pink-600 hover:text-pink-800"
                                    title="View category"
                                >
                                    <Eye size={16} />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(category);
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                    title="Delete category"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {isOpen && category.children && (
                    <div className="ml-2">
                        {category.children.map(child => (
                            <CategoryItem
                                key={child._id}
                                category={child}
                                level={level + 1}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onView={onView}
                                onAddSubcategory={onAddSubcategory}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

export default CategoryItem