import { useEffect, useState } from 'react';
import { getFineDust, getShortForecast } from './api';
import styled from 'styled-components';

import './App.css';

interface Item {
  category: string;
  fcstValue: string;
  fcstTime: string;
  // 다른 속성들도 있을 수 있음
}

const DateBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 500px;
  margin: 30px auto;
`;

const Today = styled.tr`
  width: 45px;
  height: 30px;
  background-color: #000;
  color: #fff;
  text-align: center;
  line-height: 30px;
  border-radius: 15px;
  font-weight: bold;
`;

const IconMapper = styled.td`
  width: 30px;
  height: 30px;

  display: block;
  margin: 2px auto 0;
`;

const Sunny = styled.i`
  width: 30px;
  height: 30px;
  display: block;
  background-image: url(https://ssl.pstatic.net/static/weather/image/sp_icon_weather_346e83fd.png);
  -webkit-background-size: 210px 180px;
  background-size: 210px 180px;
  background-position: 0 0;
  background-repeat: no-repeat;
`;

const LittleCloud = styled.i`
  width: 30px;
  height: 30px;
  display: block;
  background-image: url(https://ssl.pstatic.net/static/weather/image/sp_icon_weather_346e83fd.png);
  -webkit-background-size: 210px 180px;
  background-size: 210px 180px;
  background-position: 100% 20%;
  background-repeat: no-repeat;
`;

const PartlyCloudy = styled.i`
  width: 30px;
  height: 30px;
  display: block;
  background-image: url(https://ssl.pstatic.net/static/weather/image/sp_icon_weather_346e83fd.png);
  -webkit-background-size: 210px 180px;
  background-size: 210px 180px;
  background-position: 100% 60%;
  background-repeat: no-repeat;
`;

const Cloudy = styled.i`
  width: 30px;
  height: 30px;
  display: block;
  background-image: url(https://ssl.pstatic.net/static/weather/image/sp_icon_weather_346e83fd.png);
  -webkit-background-size: 210px 180px;
  background-size: 210px 180px;
  background-position: 100% 40%;
  background-repeat: no-repeat;
`;

const Temperatures = styled.li`
  margin-top: 50px;
`;

function App() {
  const [dustGrade, setDustGrade] = useState<string>('');

  //setstationAction을 쓰는것이 best practice는 아니라고 하는데 상태 값을 업데이트하는 함수의 형식을 정의하는 데 사용된다.
  const [forecastTime, setForecastTime] = useState<Array<string>>([]);
  const [weatherDegArr, setWeatherDegArr] = useState<Array<string>>([]);
  const [skyCondition, setSkyCondition] = useState<Array<string>>([]);
  const [precipitationType, setPrecipitationType] = useState<Array<string>>([]);
  const [precipitationProbability, setPrecipitationProbability] = useState<Array<string>>([]);
  const [onehourPrecipitation, setOnehourPrecipitation] = useState<Array<string>>([]);
  const [humidity, setHumidity] = useState<Array<string>>([]);
  const [snowCover, setSnowCover] = useState<Array<string>>([]);

  useEffect(() => {
    async function getDustGrade() {
      const res = await getFineDust();
      setDustGrade(res.data.response.body.items[0].pm10Grade);
      console.log('re', res.data.response.body.items[0]);
    }
    getDustGrade();

    async function getShortWeatherData() {
      const res = await getShortForecast();
      console.log('resssss', res.data.response.body.items);

      //... 스프레드연산자 때문에  new Set의 배열안의 타입을 정확하게 지정해 주지 않아서 에러가 났음
      setForecastTime([...new Set<string>(res.data.response.body.items.item.map((v: Item) => v.fcstTime.slice(0, 2)))]);

      setWeatherDegArr(res.data.response.body.items.item.filter((v: Item) => v.category == 'TMP').map((d: Item) => d.fcstValue));
      setSkyCondition(res.data.response.body.items.item.filter((v: Item) => v.category == 'SKY').map((d: Item) => d.fcstValue));
      setPrecipitationType(res.data.response.body.items.item.filter((v: Item) => v.category == 'PTY').map((d: Item) => d.fcstValue));
      setPrecipitationProbability(res.data.response.body.items.item.filter((v: Item) => v.category == 'POP').map((d: Item) => d.fcstValue));
      setOnehourPrecipitation(res.data.response.body.items.item.filter((v: Item) => v.category == 'PCP').map((d: Item) => d.fcstValue));
      setHumidity(res.data.response.body.items.item.filter((v: Item) => v.category == 'REH').map((d: Item) => d.fcstValue));
      setSnowCover(res.data.response.body.items.item.filter((v: Item) => v.category == 'SNO').map((d: Item) => d.fcstValue));
    }
    getShortWeatherData();
  }, []);

  // useEffect(() => {
  //   if (shortForecastData) {
  //     setWeatherDegArr(shortForecastData['한시간기온'].map((d: Item) => d.fcstValue));
  //   }
  // }, [shortForecastData]);

  return (
    <>
      <table>
        <caption>
          {dustGrade && (
            <div>
              {dustGrade == '1'
                ? '미세먼지가 좋음 입니다 :)'
                : dustGrade == '2'
                ? '미세먼지가 보통 입니다 :@'
                : dustGrade == '3'
                ? '미세먼지가 나쁨입니다 :('
                : dustGrade == '4'
                ? '미세먼지가 매우 나쁨입니다. 마스크를 착용하세요 :<'
                : null}
            </div>
          )}
        </caption>

        <>
          <Today>
            <th>오늘</th>
            {forecastTime.map((t: string, i: number) => (
              <th key={i}>{t}시</th>
            ))}
          </Today>

          <tr>
            <th></th>
            {skyCondition.map((t: string, i: number) => (
              <td key={i}>{t == '1' ? <Sunny /> : t == '2' ? <LittleCloud /> : t == '3' ? <Cloudy /> : <PartlyCloudy />}</td>
            ))}
          </tr>

          <tr>
            <th></th>
            {skyCondition.map((t: string, i: number) => (
              <td key={i}>{t == '1' ? '맑음' : t == '2' ? '구름조금' : t == '3' ? '구름많음' : '흐림'}</td>
            ))}
          </tr>

          <tr>
            <th>기온</th>
            {weatherDegArr.map((t: string, i: number) => (
              <td key={i}>{t}°C</td>
            ))}
          </tr>

          <tr>
            <th>강수확률</th>
            {precipitationProbability.map((t: string, i: number) => (
              <td key={i}>{t}%</td>
            ))}
          </tr>

          <tr>
            <th>강수량</th>
            {onehourPrecipitation.map((t: string, i: number) => (
              <td key={i}>{t}</td>
            ))}
          </tr>

          <tr>
            <th>습도</th>
            {humidity.map((t: string, i: number) => (
              <td key={i}>{t}</td>
            ))}
          </tr>
        </>
      </table>
      {/* {precipitationType.map((t: string, i: number) => (
        <div key={i}>강수형태 : {t == '1' ? '비' : t == '2' ? '비/눈' : t == '3' ? '눈' : t == '4' ? '소나기' : '비 소식 없음'}</div>
      ))}
      {precipitationProbability.map((t: string, i: number) => (
        <div key={i}>강수확률 : {t}%</div>
      ))}
      {onehourPrecipitation.map((t: string, i: number) => (
        <div key={i}>한시간 강수량 : {t}</div>
      ))}
      {humidity.map((t: string, i: number) => (
        <div key={i}>습도 : {t}%</div>
      ))}
      {snowCover.map((t: string, i: number) => (
        <div key={i}>적설 : {t}</div>
      ))} */}
    </>
  );
}

export default App;
