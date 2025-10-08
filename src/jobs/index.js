import cron from "cron";

const startJobs = () => {
  getDbs();

  // Run every hour at minute 0
  const job = new cron.CronJob("0 * * * *", () => {
    getDbs();
  });

  job.start();
};

export default startJobs;
