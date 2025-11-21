import { assets } from "../assets/assets";

const testimonials = [
  {
    name: "Donald Jackman",
    role: "SWE 1 @ Amazon",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100",
    rating: 4,
    text: "I've been using imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
  },
  {
    name: "Richard Nelson",
    role: "SWE 2 @ Amazon",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100",
    rating: 5,
    text: "Imagify has streamlined my workflow tremendously. Its intuitive design and features make content creation effortless.",
  },
  {
    name: "James Washington",
    role: "SWE 2 @ Google",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop",
    rating: 5,
    text: "The best AI tool I’ve used so far. It saves me hours every week and makes collaboration much easier.",
  },
];

export default function Testimonial() {
  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">What Our Creators Say</h1>
      <p className="text-sm md:text-base text-gray-500 mt-4">Here's what our users have to say</p>

      <div className="flex flex-wrap justify-center gap-5 mt-16 text-left">
        {testimonials.map((testimonial, idx) => (
          <div
            key={idx}
            className="w-80 flex flex-col items-start border border-gray-200 p-5 rounded-lg bg-white shadow-sm"
          >
            {/* Quote Icon */}
            <svg
              width="44"
              height="40"
              viewBox="0 0 44 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M33.172 5.469q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 26.539 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.923-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203m-20.625 0q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 5.914 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.922-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203"
                fill="#2563EB"
              />
            </svg>

            {/* Rating */}
            <div className="flex items-center mt-3 gap-1">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <img
                    key={index}
                    src={index < testimonial.rating ? assets.star_icon : assets.star_dull_icon}
                    className="w-4 h-4"
                    alt="star"
                  />
                ))}
            </div>

            {/* Text */}
            <p className="text-sm mt-3 text-gray-500">{testimonial.text}</p>

            {/* User Info */}
            <div className="flex items-center gap-3 mt-4">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <h2 className="text-lg text-gray-900 font-medium">{testimonial.name}</h2>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
