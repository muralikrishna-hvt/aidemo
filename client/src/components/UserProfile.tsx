import { Card, CardContent } from "@/components/ui/card";
import { userProfile } from "@/lib/dummyData";

export function UserProfile() {
  return (
    <Card className="shadow-sm border border-gray-200 h-full">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
            <span className="material-icons text-sm">person</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">{userProfile.fullName}</h2>
            <p className="text-gray-500 text-xs">{userProfile.investmentStyle} Investor • {userProfile.riskProfile} Risk</p>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-100">
          <h3 className="text-xs font-medium text-gray-500 mb-3">PORTFOLIO SUMMARY</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Total Assets</span>
                <span className="font-medium font-mono text-gray-900 text-lg">
                  ${userProfile.totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Today's Change</span>
                <span className="font-medium font-mono text-success text-sm">
                  +${userProfile.todayChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                  <span className="text-xs">({userProfile.todayChangePercent > 0 ? '+' : ''}{userProfile.todayChangePercent}%)</span>
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">YTD Return</span>
                <span className="font-medium font-mono text-success text-sm">
                  +${userProfile.ytdReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                  <span className="text-xs">({userProfile.ytdReturnPercent > 0 ? '+' : ''}{userProfile.ytdReturnPercent}%)</span>
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Cash Available</span>
                <span className="font-medium font-mono text-gray-900 text-sm">
                  ${userProfile.cashAvailable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
