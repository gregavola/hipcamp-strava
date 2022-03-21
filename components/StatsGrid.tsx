import { distanceConverter } from "../utils/distanceConverter";
import { prettyTime } from "../utils/prettyTime";
import { Stats } from "../utils/types";

export interface DefaultProps {
  title: string;
  stats: Stats;
}

function StatsGrid({ title, stats }: DefaultProps) {
  return (
    <div className="text-center">
      <h5 className="text-uppercase font-weight-bold mb-3">{title}</h5>
      <div className="mb-2 row">
        <div className="col-md-4 justify-content-center text-center mb-3">
          <h1>
            {stats.totalWorkouts.toLocaleString(navigator.language, {
              minimumFractionDigits: 0,
            })}
          </h1>
          <h6 className="d-flex text-muted justify-content-center align-items-center mb-0">
            <p className="text-uppercase mb-0">Workouts</p>
          </h6>
        </div>
        <div className="col-md-4 justify-content-center text-center mb-3">
          <h1>{distanceConverter(stats.totalDistance)}</h1>
          <h6 className="d-flex text-muted justify-content-center align-items-center">
            <p className="text-muted text-uppercase mb-0">Miles</p>
          </h6>
        </div>
        <div className="col-md-4 justify-content-center text-center mb-3">
          <h1>{prettyTime(stats.totalTime)}</h1>
          <h6 className="d-flex text-muted justify-content-center align-items-center">
            <p className="text-muted text-uppercase mb-0">Time</p>
          </h6>
        </div>
      </div>
    </div>
  );
}

export default StatsGrid;
