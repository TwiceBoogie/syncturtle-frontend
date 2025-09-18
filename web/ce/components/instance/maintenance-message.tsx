export const MaintenanceMessage = () => {
  return (
    <h1 className="text-xl font-medium text-center md:text-left">
      Plane didn't start up. This could be because one or more Plane services failed to start.
      <br />
      Choose View Logs from setup.sh and Docker logs to be sure.
    </h1>
  );
};
