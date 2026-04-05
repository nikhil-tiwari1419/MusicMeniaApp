import React from 'react'
import Qna from '../assets/QnA.json';
import { useTheme } from '../Context/Theme';

function FAQItem({
    question, answer
}) {
    const [open, setOpen] = React.useState(false);
    const { theme } = useTheme();
    const dark = theme === "dark"

    return (
        <div className={`border-b ${dark ? "border-gray-700" : "border-gray-200"}`}>
            <button
                onClick={() => setOpen(!open)}
                className={`w-full flex justify-between items-center py-4 px-2 text-left font-medium text-sm sm:text-base cursor-pointer ${dark ? "text-white hover:text-gray-200 " : "text-gray-800 hover:text-gray-600"}`}
            >
                <span>{question}</span>
                <span className={`ml-4 flex-shrink-0 text-lg transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-4" : "max-h-0"}`}>
                <p className={`px-2 text-sm sm:text-base leading-relaxed ${dark ? "text-white" : "text-black"}`}>{answer}</p>
            </div>
        </div>
    )
}
function QnA() {
    const [activeCategory, setActiveCategory] = React.useState("all");
    const { theme } = useTheme();
    const dark = theme === "dark";

    const categories = ["all", ...new Set(Qna.map(q => q.category))];

    const filteredQna = activeCategory === "all" ? Qna : Qna.filter(q => q.category === activeCategory)
    return (
        <div className={` py-10 px-5 ${dark ? "bg-gray-800 text-white":"bg-white text-black"}`}>
            <div className='max-w-2xl mx-auto'>

                <div className='mb-8 text-center'>
                    <p className={`text-2xl font-bold tracking-widest uppercase mb-2 ${dark ? "text-green-500" : "text-green-700"}`}>Support</p>
                    <h1 className='text-2xl sm:text-4xl font-bold mb-2'> Frequently Asked Questions</h1>
                    <p className='font-semibold'>Can't find the answer? Contact our support Team. </p>
                </div>

                {/* Category Filters */}
                <div className='flex flex-wrap gap-12mb-8 justify-center'>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`${activeCategory === cat ? "border-blue-700 border-b-2 ":""} capitalize px-2 py-1.5 text-xl`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                {/* FAQ list */}
                <div
                    className={`rounded-2xl overflow-x-auto h-90 no-scrollbar text-center ${dark ? "bg-gray-800" : "bg-white"}`}
                >
                    {filteredQna.length > 0 ? filteredQna.map(q => (
                        <FAQItem key={q.id} question={q.question} answer={q.answer} />
                    )) : (
                        <p>No questions in this category found.</p>
                    )}
                </div>


            </div>

        </div>
    )
}

export default QnA