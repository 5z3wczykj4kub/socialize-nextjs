import User, { User as IUser } from '../../models/User';

const getUsersBySearch = async (search: string = ''): Promise<IUser[]> =>
  (
    await User.populate(
      (
        await User.aggregate([
          {
            $project: { search: { $concat: ['$firstName', ' ', '$lastName'] } },
          },
          {
            $match: { search: { $regex: search.trim() || '', $options: 'i' } },
          },
        ])
      ).map(({ _id }) => ({ _id })),
      { path: '_id' }
    )
  ).map(({ _id }: { _id: any }) => ({ ..._id.format() }));

export { getUsersBySearch };
