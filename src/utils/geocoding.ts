export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<{ city: string; address: string }> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'zh-CN,zh;q=0.9',
        },
      }
    );

    if (!response.ok) {
      throw new Error('地理编码请求失败');
    }

    const data = await response.json();
    const address = data.address || {};

    const city =
      address.city ||
      address.town ||
      address.county ||
      address.state ||
      address.province ||
      '';

    const road = address.road || address.street || '';
    const neighbourhood = address.neighbourhood || address.suburb || '';
    const fullAddress = [neighbourhood, road].filter(Boolean).join(' ');

    return {
      city,
      address: fullAddress || data.display_name || '',
    };
  } catch (error) {
    console.warn('反向地理编码失败，使用默认值:', error);
    return {
      city: '未知城市',
      address: '',
    };
  }
};

export const getCurrentPosition = (): Promise<{
  lat: number;
  lng: number;
}> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: 39.9042, lng: 116.4074 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        resolve({ lat: 39.9042, lng: 116.4074 });
      },
      { timeout: 5000 }
    );
  });
};
