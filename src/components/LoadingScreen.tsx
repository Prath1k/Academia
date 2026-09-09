import React from 'react';
import { ArrowUpRight, GraduationCap } from 'lucide-react';

export const LoadingScreen: React.FC = () => (
  <div className="loading-screen" role="status" aria-label="Loading AcademiaNexus">
    <div className="loading-screen__grid" />
    <div className="loading-screen__content">
      <div className="loading-screen__mark">
        <GraduationCap className="h-8 w-8" />
        <span className="loading-screen__spark loading-screen__spark--one" />
        <span className="loading-screen__spark loading-screen__spark--two" />
      </div>
      <p className="loading-screen__eyebrow">ACADEMIA NEXUS</p>
      <h1>Make the next step visible.</h1>
      <div className="loading-screen__progress" aria-hidden="true"><span /></div>
      <p className="loading-screen__status">Preparing your workspace <ArrowUpRight className="h-3.5 w-3.5" /></p>
    </div>
  </div>
);
export default LoadingScreen;