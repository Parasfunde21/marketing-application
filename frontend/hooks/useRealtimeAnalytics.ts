import { useEffect, useState } from 'react';
import { supabase } from '@lib/supabaseClient';

export function useRealtimeAnalytics() {
  const [engagement, setEngagement] = useState<Array<{ day: string; engagement: number }>>([]);

  useEffect(() => {
    const channel = supabase
      .channel('analytics-stream')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'analytics' }, async () => {
        const { data } = await supabase.from('analytics').select('created_at, engagement_rate').order('created_at', { ascending: true }).limit(30);
        setEngagement(
          (data || []).map((item) => ({
            day: new Date(item.created_at).toLocaleDateString(),
            engagement: item.engagement_rate
          }))
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return engagement;
}
