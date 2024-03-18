import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import styled from 'styled-components';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;
const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length === 1) {
      //이미지 사이즈 제한
      const maxSize = 1 * 1024 * 1024;
      if ((files as FileList)[0].size > maxSize) {
        confirm('이미지파일은 1mb미만이어야합니다');
        return;
      }

      setFile(files[0]);
    }
  };

  //트위터업로드
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet == '' || tweet.length > 180) return;
    try {
      setLoading(true);
      //firestore Database에 트윗데이터추가
      const doc = await addDoc(collection(db, 'tweets'), {
        tweet, //트윗내용
        crateAt: Date.now(), //트윗시간
        username: user.displayName || 'Anonymous', //트윗유저이름
        userId: user.uid, //유저식별아이디
      });

      //storage에 이미지파일 업로드
      if (file) {
        const locationRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${doc.id}`
        ); //storage에 저장될 경로 저장
        const result = await uploadBytes(locationRef, file); //uploadBytes->blob 또는 file 업로드
        const url = await getDownloadURL(result.ref); //getDownloadURL->url을 통해 데이터 다운로드
        await updateDoc(doc, {
          photo: url,
        }); //updateDoc-> 전체문서를 덮어쓰지 않고 문서의 일부 필드를 업데이트
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setTweet('');
      setFile(null);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder='What is happening?!'
      />
      <AttachFileButton htmlFor='file'>
        {file ? 'photo added✅' : 'Add photo'}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        name='file'
        type='file'
        id='file'
        accept='image/*'
      />
      <SubmitBtn
        type='submit'
        value={isLoading ? 'Posting...' : 'post Tweet'}
      />
    </Form>
  );
}
