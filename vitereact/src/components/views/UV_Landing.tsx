import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/main';

interface Feature {
  title: string;
  description: string;
  link: string;
}

interface Testimonial {
  name: string;
  quote: string;
  profile_picture_url: string;
}

const UV_Landing: React.FC = () => {
  const currentUser = useAppStore(state => state.authentication_state.current_user);
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);

  const landingContent = {
    features: [
      {
        title: "Eco-friendly Living",
        description: "Discover tips and tricks for living a more sustainable life.",
        link: "/resources",
      },
      {
        title: "Join the Community",
        description: "Connect with others passionate about sustainability.",
        link: "/community-forum",
      },
    ],
    testimonials: [
      {
        name: "Alice Johnson",
        quote: "Eco7 has completely transformed the way I approach sustainability!",
        profile_picture_url: "https://example.com/alice.jpg",
      },
      {
        name: "Bob Smith",
        quote: "A wonderful resource for anyone looking to make a difference.",
        profile_picture_url: "https://example.com/bob.jpg",
      },
    ],
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center py-12">
        <div className="max-w-4xl mx-auto text-center space-y-12 px-4">
          <h1 className="text-4xl font-bold leading-tight text-gray-900">
            Welcome to Eco7
          </h1>
          <p className="text-base leading-relaxed text-gray-600">
            {isAuthenticated ? (
              `Hello, ${currentUser?.name}! Explore our features to enhance your sustainable lifestyle.`
            ) : (
              "Join us in making the world a better place with Eco7."
            )}
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {landingContent.features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
                <Link
                  to={feature.link}
                  className="inline-block px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Learn More
                </Link>
              </div>
            ))}
          </div>

          {isAuthenticated ? null : (
            <Link
              to="/register"
              className="inline-block mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition"
            >
              Sign Up to Get Started
            </Link>
          )}

          <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-semibold text-gray-900">What Our Users Say</h2>
            <div className="space-y-6">
              {landingContent.testimonials.map((testimonial, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
                  <img
                    src={testimonial.profile_picture_url}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mb-4"
                  />
                  <blockquote className="text-gray-600 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <cite className="mt-4 text-sm text-gray-900">
                    - {testimonial.name}
                  </cite>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_Landing;