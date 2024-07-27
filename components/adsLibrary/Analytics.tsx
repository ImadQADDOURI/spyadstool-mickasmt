import { Ad } from "@/types/ad";

const Analytics: React.FC<{ ads: Ad[] }> = ({ ads }) => {
  // Implement analytics and charts based on the loaded ads
  return (
    <div>
      <h3 className="mb-2 text-xl font-semibold">Analytics</h3>
      {/* Add your analytics and charts here */}
      <p>Total Ads: {ads.length}</p>
      {/* Add more analytics as needed */}
    </div>
  );
};

export default Analytics;
