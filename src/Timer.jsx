import { useEffect, useRef, useState } from "react";

const SettingTimer = ({ time }) => {
  const { hours, minutes, seconds } = time;
  return (
    <>
      <span>{String(hours).padStart(2, "0")}</span>:
      <span>{String(minutes).padStart(2, "0")}</span>:
      <span>{String(seconds).padStart(2, "0")}</span>
    </>
  );
};

const Timer = () => {
  //무엇이 시작되고 있는지 상태명 좀 더 상세하게 작성
  const [isRunning, setRunning] = useState(false);

  const [record, setRecord] = useState([]);

  //const [timer, setTimer] = useState(0)
  //120 -> 00:02:00 파싱해주는 함수를 만든다
  //위처럼 하면 계산 없이 숫자 +1 추가만 해주면 됨
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  //timeout id를 담기 위한 ref
  let intervalRef = useRef(null);

  //시간을 set하는 함수
  const startTimer = () => {
    setTime((prevTime) => {
      let { hours, minutes, seconds } = prevTime;
      seconds += 1;
      if (seconds === 60) {
        seconds = 0;
        minutes += 1;
      }
      if (minutes === 60) {
        minutes = 0;
        hours += 1;
      }
      return { hours, minutes, seconds };
    });
  };

  //interver을 통해 timer함수를 1초마다 반복 실행
  //isRunning true일 때
  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      startTimer();
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, startTimer]);

  const handleStart = () => {
    if (intervalRef.current && !isRunning) {
      clearInterval(intervalRef.current); // 기존 interval 정리
    }
    setRunning(true);
  };

  const handleRecord = () => {
    const { hours, minutes, seconds } = time;
    const recordedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    setRecord([...record, recordedTime]);
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const handleReset = () => {
    setRunning(false);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
  };
  return (
    <>
      <div>{<SettingTimer time={time} />}</div>
      <button onClick={handleStart}>start</button>
      <button onClick={handleRecord}>record</button>
      <button onClick={handleReset}>stop</button>
      <button onClick={handlePause}>pause</button>
      <ul>
        {record.map((item, i) => {
          return <li key={i}>{item}</li>;
        })}
      </ul>
    </>
  );
};
export default Timer;

{
  /* 타이머 만들기
      00:00:00
      23:59:59
      start, record, stop, pause

      (o) start를 누르면 초가 1초씩 증가한다.
      record 를 누르면 아래 현지 HH:MM:SS 기록, 누적
      stop을 누르면 0초로 돌아가면서 stop
      pause를 누르면 일시정지 다시 start 누르면 재실행

      setInterval, clearInterval, useRef, props 사용
      */
}
