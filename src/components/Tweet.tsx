import styled from 'styled-components';
import { ITweet } from './TimeLine';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;
const Column = styled.div``;
const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;

  //삭제
  const onDelete = async () => {
    const ok = confirm('Are you sure you want to delete this tweet?');
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, 'tweets', id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`); //ref-> ref함수를 사용하여 저장소에서 이미지 파일의 참조를 얻는다 / ref함수의 인자(저장소,파일경로)
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}

/*
Document 삭제(deleteDoc)
document를 삭제하려면 delete()메서드를 사용

파일삭제(deleteObject)
파일을 삭제하려면 해당 파일에 대한 reference를 만든다
그런 다음 해당 reference에 대해 delete()메서드를 호출
*/
