import type { VFC } from "react";
import { useEffect, useState } from "react";
import { getReservationList } from "src/component/separate/Admin/fetch/getReservationList";
import { getScheduleList } from "src/component/separate/Admin/fetch/getScheduleList";
import { getVimeoUserList } from "src/component/separate/Admin/fetch/getVimeoUserList";
import { ReservationItem } from "src/component/separate/Admin/ReservationItem";
import { ScheduleItem } from "src/component/separate/Admin/ScheduleItem";
import { Section } from "src/component/separate/Admin/Section";
import { VimeoUserItem } from "src/component/separate/Admin/VimeoUserItem";
import type { Reservation, Schedule, VimeoUser } from "src/constants/types";

export const UserFlow: VFC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [vimeoUsers, setVimeoUsers] = useState<VimeoUser[]>([]);

  const fetchReservationList = async () => {
    const data = await getReservationList();
    setReservations(data);
  };

  const fetchScheduleList = async () => {
    const data = await getScheduleList();
    setSchedules(data);
  };

  const fetchVimeoUserList = async () => {
    const data = await getVimeoUserList();
    setVimeoUsers(data);
  };

  useEffect(() => {
    fetchReservationList();
    fetchScheduleList();
    fetchVimeoUserList();
  }, []);

  return (
    <div className="flex flex-wrap p-2">
      <Section title="ZOOM日程調整">
        {reservations.map((reservation) => (
          <ReservationItem
            key={reservation.studentId}
            reservation={reservation}
            setReservations={setReservations}
            setSchedules={setSchedules}
          />
        ))}
      </Section>
      <Section title="ZOOMスケジュール">
        {schedules.map((schedule) => (
          <ScheduleItem
            key={schedule.studentId}
            schedule={schedule}
            setSchedules={setSchedules}
            setVimeoUsers={setVimeoUsers}
          />
        ))}
      </Section>
      <Section title="動画処理中">
        {vimeoUsers.map((vimeoUser) => (
          <VimeoUserItem key={vimeoUser.studentId} vimeoUser={vimeoUser} setVimeoUsers={setVimeoUsers} />
        ))}
      </Section>
    </div>
  );
};
