import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Globe, Network } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden py-20 px-4"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400 bg-clip-text text-transparent">
              Xytherra
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 mb-8">
              4X Grand Strategy Game Design
            </p>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg text-slate-400 max-w-3xl mx-auto mb-12"
          >
            A galactic 4X where planets are the tech tree. Each planet type represents a technology domain, 
            and empires develop unique identities based on which planets they explore, colonize, and control first.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: Globe, title: 'Explore', desc: 'Discover diverse planetary systems with unique tech domains' },
              { icon: Zap, title: 'Expand', desc: 'Specialized colonization based on planet adaptation technology' },
              { icon: Network, title: 'Exploit', desc: 'Unlock hybrid technologies through planetary mastery' },
              { icon: Sparkles, title: 'Exterminate', desc: 'Strategic warfare focused on securing tech advantages' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-colors duration-300"
              >
                <item.icon className="w-8 h-8 text-blue-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.section>

      {/* Core Concept Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 bg-slate-800/50"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Core Innovation</h2>
          <div className="text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8"
            >
              <h3 className="text-2xl font-bold mb-4">Planets as Technology Trees</h3>
              <p className="text-lg">
                Unlike traditional 4X games with linear tech progression, Xytherra's technology system is 
                entirely driven by planetary colonization. Each planet type unlocks unique technology domains, 
                and the order of colonization permanently shapes your empire's technological identity.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-slate-700/50 border border-slate-600 rounded-xl p-6"
              >
                <h4 className="text-xl font-semibold mb-3 text-blue-400">Traditional 4X</h4>
                <p className="text-slate-300">
                  Linear tech trees → Same paths every game → Predictable strategies
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-slate-700/50 border border-slate-600 rounded-xl p-6"
              >
                <h4 className="text-xl font-semibold mb-3 text-purple-400">Xytherra</h4>
                <p className="text-slate-300">
                  Planet-driven tech → Unique paths every game → Dynamic strategies
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;