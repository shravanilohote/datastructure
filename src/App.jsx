import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PinModal } from './components/PinModal';

// Pages
import { HomeFeed } from './pages/HomeFeed';
import { ExplorePins } from './pages/ExplorePins';
import { PeopleGraph } from './pages/PeopleGraph';
import { NotificationsQueue } from './pages/NotificationsQueue';
import { CreatePinStack } from './pages/CreatePinStack';
import { DataStructureLab } from './pages/DataStructureLab';
import { ComplexityAnalysis } from './pages/ComplexityAnalysis';
import { ArchitectureFlow } from './pages/ArchitectureFlow';
import { AboutProject } from './pages/AboutProject';

function MainLayout() {
  const { activeTab, selectedPinModal, setSelectedPinModal } = useApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeFeed />;
      case 'explore':
        return <ExplorePins />;
      case 'people':
        return <PeopleGraph />;
      case 'notifications':
        return <NotificationsQueue />;
      case 'create':
        return <CreatePinStack />;
      case 'lab':
        return <DataStructureLab />;
      case 'complexity':
        return <ComplexityAnalysis />;
      case 'architecture':
        return <ArchitectureFlow />;
      case 'about':
        return <AboutProject />;
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Body with Sidebar + Active Page */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto min-w-0 pb-16">
          {renderActiveTab()}
        </main>
      </div>

      {/* Global Pin Modal Inspector */}
      {selectedPinModal && (
        <PinModal
          pin={selectedPinModal}
          onClose={() => setSelectedPinModal(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
