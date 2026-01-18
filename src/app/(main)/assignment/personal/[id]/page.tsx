'use client';

import { useParams } from 'next/navigation';

export default function IndividualAssignmentDetail() {
  const params = useParams();
  const id = params.id; // URL에서 [id] 값을 가져옴

  return <h1>개인 과제 상세 페이지 (ID: {id})</h1>;
}
