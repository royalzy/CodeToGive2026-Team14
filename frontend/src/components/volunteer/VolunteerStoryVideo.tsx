import { useRef } from "react";

import type { VolunteerRole } from "../../content/volunteer";
import { trackVolunteerEvent } from "../../lib/volunteerAnalytics";

export function VolunteerStoryVideo({
  role,
  journeyPath,
}: {
  role: VolunteerRole;
  journeyPath: "quick" | "guided";
}) {
  const started = useRef(false);

  function trackStarted() {
    if (started.current) {
      return;
    }
    started.current = true;
    trackVolunteerEvent("volunteer_story_video_started", {
      journey_path: journeyPath,
      role_id: role.id,
    });
  }

  function trackCompleted() {
    trackVolunteerEvent("volunteer_story_video_completed", {
      journey_path: journeyPath,
      role_id: role.id,
    });
  }

  return (
    <div className="volunteer-story">
      <div className="volunteer-story-copy">
        <p className="eyebrow">A volunteer's story</p>
        <h2>See what volunteering really feels like.</h2>
        <p className="large-copy">
          Hear what a volunteer actually does, what support is available and what
          they take away from showing up alongside the Love 21 community.
        </p>
        <ul className="volunteer-story-points">
          <li>The practical things a volunteer does during an activity</li>
          <li>What can feel uncertain before a first visit</li>
          <li>The connection, confidence and perspective they gain</li>
        </ul>
        <p className="field-hint">
          Demo media: all three role pages currently use the same sample video. A
          final volunteer story must include approved captions or a transcript.
        </p>
      </div>
      <div className="volunteer-video-frame">
        <div className="demo-badge">Volunteer story · demo</div>
        <video
          controls
          playsInline
          preload="metadata"
          aria-label={`Volunteer story for people exploring the ${role.title} role`}
          onPlay={trackStarted}
          onEnded={trackCompleted}
        >
          <source src="/video/volunteer-story.mp4" type="video/mp4" />
          Your browser does not support embedded video.
        </video>
      </div>
    </div>
  );
}
