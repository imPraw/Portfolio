import Image from "next/image";
import { AudioLines, Braces, ChevronRight, FileText, GitBranch, LayoutGrid, Mail, Shield, Terminal, Users } from "lucide-react";
import type { Project } from "@/lib/content";

export function ProjectArt({ project }: { project: Project }) {
  const isCapture = project.id === "glass";
  return (
    <figure className={`project-art ${project.id}-art`}>
      <div className="art-canvas">
        {project.id === "agent" && (
          <div className="mock-window agent-window" aria-hidden="true">
            <div className="mock-titlebar"><Terminal size={15} /> inbox / workflow <span className="window-controls">···</span></div>
            <div className="agent-screen">
              <div className="art-kicker"><GitBranch size={15} /> EMAIL WORKFLOW</div>
              <div className="flow">
                <div><Mail /><span>Receive</span></div>
                <ChevronRight className="flow-arrow" />
                <div className="flow-active"><Braces /><span>Classify</span></div>
                <ChevronRight className="flow-arrow" />
                <div><FileText /><span>Respond</span></div>
              </div>
              <pre><span>def</span>{" score_rules(subject, body):"}<br />{"    text = f\"{subject}\\n{body}\".lower()"}</pre>
            </div>
          </div>
        )}
        {project.id === "insurance" && (
          <div className="mock-window insurance-window" aria-hidden="true">
            <div className="mock-titlebar"><Shield size={15} /> Insurance Management <span className="window-controls">···</span></div>
            <div className="insurance-screen">
              <div className="mock-sidebar"><LayoutGrid /><FileText /><Users /></div>
              <div className="mock-dashboard">
                <div className="art-kicker">MANAGEMENT DASHBOARD</div>
                <strong>Claims overview</strong>
                <div className="mock-table">
                  <div><b>Claim</b><b>Status</b></div>
                  <div><span>Property claim</span><span>Submitted</span></div>
                  <div><span>Policy claim</span><span>Under review</span></div>
                  <div><span>Vehicle claim</span><span>Approved</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {project.id === "glass" && (
          <div className="mock-window glass-window">
            <div className="mock-titlebar"><AudioLines size={15} /> Glasswave <span className="window-controls">···</span></div>
            <Image className="glass-capture" src="/media/glasswave.jpg" width={1050} height={660} sizes="(max-width: 850px) 85vw, 650px" alt="Glasswave style study with glass controls and circular album artwork" />
          </div>
        )}
        {project.id === "chess" && (
          <div className="mock-window chess-window" aria-hidden="true">
            <div className="mock-titlebar"><Terminal size={15} /> chess.py <span className="window-controls">···</span></div>
            <div className="chess-screen">
              <div className="mock-board">
                {Array.from({ length: 64 }, (_, i) => {
                  const piece = i === 4 ? "♚" : i < 16 && i >= 8 ? "♟" : i >= 48 && i < 56 ? "♙" : i === 60 ? "♔" : "";
                  return <span key={i} className={(i + Math.floor(i / 8)) % 2 ? "tinted" : ""}>{piece}</span>;
                })}
              </div>
              <div className="chess-prompt"><span>$</span> python chess.py<br />White to move<br /><span>›</span> e2 e3</div>
            </div>
          </div>
        )}
      </div>
      <figcaption>
        {isCapture ? <>Style study using the project’s alternate stylesheet <span aria-hidden="true">·</span> <a href="/media/glasswave-source.jpg">Original capture</a></> : "Illustrative preview based on the source"}
      </figcaption>
    </figure>
  );
}
