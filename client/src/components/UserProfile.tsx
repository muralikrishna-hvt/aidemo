import { Card, CardContent } from "@/components/ui/card";
import { userProfile } from "@/lib/dummyData";

export function UserProfile() {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-5">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center">
            <span className="material-icons">person</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">{userProfile.fullName}</h2>
            <p className="text-gray-500 text-sm">{userProfile.investmentStyle} Investor • {userProfile.riskProfile} Risk</p>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-3">PORTFOLIO SUMMARY</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Assets</span>
              <span className="font-medium font-mono text-gray-900">
                ${userProfile.totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Today's Change</span>
              <span className="font-medium font-mono text-success">
                +${userProfile.todayChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                ({userProfile.todayChangePercent > 0 ? '+' : ''}{userProfile.todayChangePercent}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">YTD Return</span>
              <span className="font-medium font-mono text-success">
                +${userProfile.ytdReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                ({userProfile.ytdReturnPercent > 0 ? '+' : ''}{userProfile.ytdReturnPercent}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Cash Available</span>
              <span className="font-medium font-mono text-gray-900">
                ${userProfile.cashAvailable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
